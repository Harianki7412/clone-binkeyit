const generatedOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}

export default generatedOtp;