For Updating

1. Delete node_modules folder
2. Select latest RN version and run
    $ npm install --save react-native@X.Y
    # where X.Y is the semantic version you are upgrading to
    npm WARN peerDependencies The peer dependency react@~R included from react-native...
3. Note the peer dependency of react from the terminal and change it in package.json
    $ npm install --save react@R
    # where R is the new version of react from the peerDependency warning you saw
4. Simply change every dependency's version to '*', then run
        npm update --save
        npm update --save-dev
5. $ react-native upgrade
