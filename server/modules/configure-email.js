const configure = () => {
    const smtp = {
            username: 'motobite',
            password: 'HTaLeG2PEK6C',
            server:   'smtp.sendgrid.net',
            port: 587
        };
    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
}

Modules.server.configureEmail = configure;