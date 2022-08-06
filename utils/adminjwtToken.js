// Create and send token and save in cookie
const sendToken = (user, statusCode, res) => {
  // Create JWT Token

  const token = user.getJwtToken();
  const refreshToken = user.getRefreshToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // if(process.env.NODE_ENV === 'production ') {
  //     options.secure = true;
  // }

  res.status(statusCode).cookie("refresh_token", refreshToken, options).json({
    success: true,
    name: user.name,
    token

  });
};

module.exports = sendToken;
