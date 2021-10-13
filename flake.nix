{
  description = "";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs?ref=nixos-21.05";
  outputs = { self, nixpkgs }:
    let
      # System types to support.
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" ];

      # Helper function to generate an attrset '{ x86_64-linux = f "x86_64-linux"; ... }'.
      forAllSystems = f:
        nixpkgs.lib.genAttrs supportedSystems (system: f system);

      # Nixpkgs instantiated for supported system types.
      nixpkgsFor = forAllSystems (
        system:
          import nixpkgs {
            inherit system;
            overlays = [ self.overlay ];
          }
      );
    in
      {

        overlay = final: prev:
          with final; {
            editoria = mkYarnPackage rec {
              src = ./.;
              name = "editoria";
              packageJSON = ./package.json;
              yarnLock = ./yarn.lock;
            };

          };

        packages =
          forAllSystems (system: { inherit (nixpkgsFor.${system}) editoria; });

        defaultPackage = forAllSystems (system: self.packages.${system}.editoria);
      };
}
