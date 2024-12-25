const verifyEmailTemplate = ({ name, url }) => {
    return `
    <h2>Hi ${name}</h2>
    <h1>Verify Your Email Address</h1>
    <p>Thank you for creating an account with Binkeyit.</p>
    <a href="${url}" style="color:white;background:blue;margin-top:10px padding:20px,display:block">
        Verify Email
    </a>
    `
}

export default verifyEmailTemplate;