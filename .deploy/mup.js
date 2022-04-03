module.exports = {
  servers: {
    one: {
      host: '104.155.196.199',
      username: 'k_rakeshlal',
      pem:  '/Users/rakeshkalyankar/.ssh/google_compute_engine'
      // password:
      // or leave blank for authenticate from ssh-agent
    }
  },

  meteor: {
    name: 'MotoBite',
    path: '../',
    servers: {
      one: {},
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://app.motobite.in',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

     ssl: {
      // Enables let's encrypt (optional)
      autogenerate: {
        email: 'k.rakeshlal@gmail.com',
        domains: 'app.motobite.in' // comma seperated list of domains
      }
    },
     
    // change to 'kadirahq/meteord' if your app is not using Meteor 1.4
    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 300,
    
    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: false
  },

  mongo: {
    oplog: true,
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {},
    },
  },
};
