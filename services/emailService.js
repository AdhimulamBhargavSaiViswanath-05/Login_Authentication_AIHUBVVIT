const nodemailer = require('nodemailer');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
require('isomorphic-fetch');

// ==================== GMAIL CONFIGURATION ====================
// Gmail transporter for non-Microsoft users and fallback
const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 10,
  rateLimit: 2,
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  },
  logger: false,
  debug: false
});

// Verify Gmail transporter
gmailTransporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Gmail SMTP verification failed:', error.message);
  } else {
    console.log('✅ Gmail SMTP server is ready');
  }
});

// ==================== MICROSOFT GRAPH API CONFIGURATION ====================
let graphClient = null;
let graphApiEnabled = false;

// Initialize Microsoft Graph client only if credentials are properly configured
function initializeGraphClient() {
  try {
    // Check if all required environment variables are set
    if (!process.env.MICROSOFT_CLIENT_ID || 
        !process.env.MICROSOFT_CLIENT_SECRET || 
        !process.env.MICROSOFT_TENANT_ID ||
        !process.env.MICROSOFT_SENDER_EMAIL) {
      console.log('⚠️  Microsoft Graph API not configured - using Gmail for all emails');
      console.log('   To enable: Configure Mail.Send permission in Azure and set MICROSOFT_SENDER_EMAIL in .env');
      return;
    }

    // Skip if using "common" tenant (multi-tenant OAuth, not for sending emails)
    if (process.env.MICROSOFT_TENANT_ID === 'common') {
      console.log('⚠️  Microsoft Graph API disabled (MICROSOFT_TENANT_ID=common)');
      console.log('   For production: Change to your organization tenant ID (see AZURE_EMAIL_GUIDE.md)');
      return;
    }

    const credential = new ClientSecretCredential(
      process.env.MICROSOFT_TENANT_ID,
      process.env.MICROSOFT_CLIENT_ID,
      process.env.MICROSOFT_CLIENT_SECRET
    );

    graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
          return tokenResponse.token;
        }
      }
    });

    graphApiEnabled = true;
    console.log('✅ Microsoft Graph API initialized successfully');
    console.log(`   Sender: ${process.env.MICROSOFT_SENDER_EMAIL}`);
  } catch (error) {
    console.error('❌ Failed to initialize Microsoft Graph API:', error.message);
    console.log('   Falling back to Gmail for all emails');
    graphApiEnabled = false;
  }
}

// Initialize on startup
initializeGraphClient();

/**
 * Detect if email is a Microsoft domain
 */
function isMicrosoftEmail(email) {
  const microsoftDomains = [
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    'office365.com',
    'vvit.net', // Your institution using Microsoft 365
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return microsoftDomains.includes(domain);
}

/**
 * Send email via Microsoft Graph API (for Microsoft users)
 */
async function sendViaGraphAPI(mailOptions) {
  if (!graphApiEnabled || !graphClient) {
    throw new Error('Microsoft Graph API not initialized');
  }

  console.log('   📬 Sending via Microsoft Graph API...');

  try {
    const sendMail = {
      message: {
        subject: mailOptions.subject,
        body: {
          contentType: 'HTML',
          content: mailOptions.html || mailOptions.text
        },
        toRecipients: [
          {
            emailAddress: {
              address: mailOptions.to
            }
          }
        ]
      },
      saveToSentItems: false
    };

    // Send email using Microsoft Graph API
    await graphClient
      .api(`/users/${process.env.MICROSOFT_SENDER_EMAIL}/sendMail`)
      .post(sendMail);

    console.log(`   ✅ Email sent successfully via Microsoft Graph API!`);
    return { success: true, provider: 'Microsoft Graph API' };

  } catch (error) {
    console.error(`   ❌ Microsoft Graph API failed:`, error.message);
    
    // Check for common errors
    if (error.statusCode === 403) {
      console.error('   🔒 Permission Error: Mail.Send permission not granted in Azure');
      console.error('   📖 See AZURE_EMAIL_GUIDE.md for setup instructions');
    } else if (error.statusCode === 404) {
      console.error('   👤 User not found: Check MICROSOFT_SENDER_EMAIL in .env');
    }
    
    throw error;
  }
}

/**
 * Send email via Gmail SMTP (for non-Microsoft users and fallback)
 */
async function sendViaGmail(mailOptions, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`   📧 Attempt ${attempt}/${retries} via Gmail SMTP...`);
      
      const enhancedOptions = {
        ...mailOptions,
        from: `"AIHUB-VVIT Team" <${process.env.EMAIL_USER}>`,
        replyTo: mailOptions.replyTo || 'aihub-vvit@vvit.net',
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'Normal',
          'X-Mailer': 'AIHUB-VVIT Mailer v2.0',
          'Organization': 'AIHUB-VVIT',
          'List-Unsubscribe': '<mailto:bhargavsaiadhimulam12@gmail.com?subject=unsubscribe>',
        },
        text: mailOptions.text || 'Please view this email in HTML format.',
      };

      const info = await gmailTransporter.sendMail(enhancedOptions);
      
      console.log(`   ✅ Email sent successfully via Gmail!`);
      console.log(`      Message ID: ${info.messageId}`);
      
      return { success: true, provider: 'Gmail SMTP', messageId: info.messageId };

    } catch (error) {
      console.error(`   ❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        console.log(`   ⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

/**
 * Main email sending function - intelligently chooses the best method
 */
async function sendEmail(mailOptions) {
  const recipientEmail = mailOptions.to;
  
  console.log(`\n📧 Preparing to send email:`);
  console.log(`   To: ${recipientEmail}`);
  console.log(`   Subject: ${mailOptions.subject}`);
  
  const isMicrosoft = isMicrosoftEmail(recipientEmail);
  console.log(`   Domain Type: ${isMicrosoft ? '🟦 Microsoft/Outlook' : '🌐 Other'}`);
  
  // Add delay to appear more natural
  console.log(`   ⏳ Waiting 2 seconds before sending...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Strategy: Use Microsoft Graph API for Microsoft domains if available
    if (isMicrosoft && graphApiEnabled) {
      console.log(`   ✅ Using Microsoft Graph API (best for Microsoft domains)`);
      try {
        const result = await sendViaGraphAPI(mailOptions);
        console.log(`✅ SUCCESS! Email delivered via Microsoft Graph API to: ${recipientEmail}\n`);
        return result;
      } catch (graphError) {
        console.log(`   ⚠️  Microsoft Graph failed, falling back to Gmail...`);
        // Fall through to Gmail
      }
    }
    
    // Fallback to Gmail or primary method for non-Microsoft domains
    if (isMicrosoft && !graphApiEnabled) {
      console.log(`   ⚠️  Using Gmail for Microsoft domain (not ideal - may be blocked)`);
      console.log(`   💡 Recommendation: Configure Microsoft Graph API (see AZURE_EMAIL_GUIDE.md)`);
    }
    
    const result = await sendViaGmail(mailOptions);
    console.log(`✅ SUCCESS! Email delivered via Gmail to: ${recipientEmail}\n`);
    return result;
    
  } catch (error) {
    console.error(`\n❌ CRITICAL: Failed to send email after all attempts!`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Recipient: ${recipientEmail}`);
    
    if (isMicrosoft) {
      console.error(`   💡 Microsoft user detected - Recommendation:`);
      console.error(`      1. Configure Microsoft Graph API for 100% deliverability`);
      console.error(`      2. Or use SendGrid as alternative`);
      console.error(`      3. See AZURE_EMAIL_GUIDE.md for instructions`);
    }
    
    console.log('');
    throw error;
  }
}

module.exports = {
  sendEmail,
  isMicrosoftEmail,
  gmailTransporter,
  graphApiEnabled
};
