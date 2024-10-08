import AppError from "../utils/errorUtil.js";
import sendEmail from "../utils/sendEmail.js";

export const contactUs = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError("Name, Email, and Message are required", 400));
  }

  try {
    const subject = "Contact Us Form";
    const textMessage = `
      <div >
        <img src="../../frontend/src/assets/logo.png" alt="Farm to Market Logo" style="width: 150px;"/>
        <h1>New Contact Us Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;

    await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
  } catch (error) {
    return next(
      new AppError("Failed to send email. Please try again later.", 500)
    );
  }

  res.status(200).json({
    success: true,
    message: "Your request has been submitted successfully",
  });
};
