import sendEmail from '../config/sendEmail.js';
import UserModal from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageClodinary from '../utils/uploadImageClodinary.js';
import generatedOtp from '../utils/generatedOtp.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: 'All fields are required!',
                error: true,
                success: false
            });
        }
        const user = await UserModal.findOne({ email });
        if (user) {
            return response.json({
                message: 'User already exists!',
                error: true,
                success: false
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const payload = {
            name,
            email,
            password: hashedPassword
        };
        const newUser = new UserModal(payload);
        const save = await newUser.save();
        const VerifyEmailUrl = `${process.env.RESEND_OTP}/verify-email?code=${save._id}`;
        await sendEmail({
            from: 'onboarding@resend.dev',
            sendTo: email,
            subject: 'Verify Email for Binkeyit',
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })
        return response.json({
            message: 'User registered successfully!',
            success: true,
            error: false,
            data: save
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body;
        const user = await UserModal.findOne({ _id: code });
        if (!user) {
            return response.status(404).json({
                message: 'User not found!',
                error: true,
                success: false
            });
        }

        const updatedUser = await UserModal.updateOne({ _id: code }, {
            verify_email: true
        })

        return response.json({
            message: 'Email verified successfully!',
            success: true,
            error: false,
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });

    }
}

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).json({
                message: 'All fields are required!',
                error: true,
                success: false
            });
        }
        const user = await UserModal.findOne({ email })
        if (!user) {
            return response.status(404).json({
                message: 'User not Registered!',
                error: true,
                success: false
            });
        }
        if (user.status !== 'Active') {
            return response.status(401).json({
                message: 'User not verified!',
                error: true,
                success: false
            });

        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: 'Invalid password!',
                error: true,
                success: false
            });
        }
        const accessToken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        const updateUser = await UserModal.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })




        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        response.cookie('accessToken', accessToken, cookieOptions);
        response.cookie('refreshToken', refreshToken, cookieOptions);
        return response.json({
            message: 'User logged in successfully!',
            success: true,
            error: false,
            data: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function logoutController(request, response) {
    try {

        const userid = request.userId

        const { accessToken } = request.cookies;
        if (!accessToken) {
            return response.status(401).json({
                message: 'User not logged in!',
                error: true,
                success: false
            });
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        };
        response.clearCookie('accessToken', cookieOptions);
        response.clearCookie('refreshToken', cookieOptions);

        const removeRefreshToken = await UserModal.findByIdAndUpdate(userid, {
            refresh_token: ''
        })

        return response.json({
            message: 'logged out successfully!',
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function uploadAvatar(request, response) {
    try {

        const userId = request.userId
        const image = request.file

        const upload = await uploadImageClodinary(image)

        const updateUser = await UserModal.findByIdAndUpdate(userId, {
            avatar: upload.url
        })



        return response.json({
            message: 'Image uploaded successfully!',
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId
        const { name, email, mobile, password } = request.body
        let hashedPassword = ""
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }
        const updateUser = await UserModal.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashedPassword })
        })
        return response.json({
            message: 'Updated successfully',
            success: true,
            error: false,
            data: updateUser
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body
        const user = await UserModal.findOne({ email })
        if (!user) {
            return response.status(404).json({
                message: 'Email not found!',
                error: true,
                success: false
            })
        }
        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000
        const update = await UserModal.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })
        await sendEmail({
            sendTo: email,
            subject: 'Forgot Password from Binkeyit OTP',
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })
        return response.json({
            message: 'OTP sent to your email!',
            success: true,
            error: false,

        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: 'All fields are required!',
                error: true,
                success: false
            })
        }


        const user = await UserModal.findOne({ email })
        if (!user) {
            return response.status(404).json({
                message: 'Email not found!',
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: 'OTP expired!',
                error: true,
                success: false
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: 'Invalid OTP!',
                error: true,
                success: false
            })
        }

        const updateUser = await UserModal.findByIdAndUpdate(user?._id, {
            forgot_password_otp: '',
            forgot_password_expiry: ''
        })




        return response.json({
            message: 'OTP verified successfully!',
            success: true,
            error: false
        })




    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function resetpassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: 'All fields are required!',
            })
        }
        const user = await UserModal.findOne({ email })
        if (!user) {
            return response.status(404).json({
                message: 'Email not found!',
                error: true,
                success: false
            })
        }
        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: 'Password does not match!',
                error: true,
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const update = await UserModal.findByIdAndUpdate(user._id, {
            password: hashedPassword
        })

        return response.json({
            message: 'Password reset successfully!',
            success: true,
            error: false
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(' ')[1]
        if (!refreshToken) {
            return response.status(401).json({
                message: 'User not logged in!',
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return response.status(401).json({
                message: 'token is expired!',
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        response.cookie('accessToken', newAccessToken, cookieOptions)

        return response.json({
            message: 'New access token generated!',
            success: true,
            error: false,
            data: {
                accessToken: newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}

export async function UserDetails(request, response) {
    try {
        const userId = request.userId

        const user = await UserModal.findById(userId).select('-password -refresh_token')
        return response.json({
            message: 'User details!',
            success: true,
            error: false,
            data: user
        })


    } catch (error) {
        response.status(500).json({
            message: "Something went wrong!",
            error: true,
            success: false
        })
    }
}