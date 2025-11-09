{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [ pkgs.nodejs_20 ];
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "google.gemini-cli-vscode-ide-companion"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        # The dev server is now managed by the preview configuration below
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["sh" "-c" "PORT=$PORT npm run dev"];
          manager = "web";
        };
      };
    };
  };
}
