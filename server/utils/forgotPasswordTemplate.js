const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div>
        <h1>Hi ${name}</h1>
        <h3>Here is your OTP for resetting your password</h3>
        <h2>${otp}</h2>
        <p>Use this OTP to reset your password</p>
        <p>Regards</p>
        <p>Team</p>


    </div>
    `
}

export default forgotPasswordTemplate