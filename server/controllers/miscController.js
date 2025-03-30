import AppError from "../utils/errorUtil.js";
import sendEmail from "../utils/sendEmail.js";

export const contactUs = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError("Name, Email, and Message are required", 400));
  }

  try {
    const subject = "Contact Us Form Submission";
    const logoUrl = "https://res.cloudinary.com/djolaenik/image/upload/v1728111251/F2M/kphj27bv5fw9hglp7ptg.png"; // Replace with a hosted image URL

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <img src="${logoUrl}" alt="Farm to Market Logo" style="width: 150px;"/>
        <h2>New Contact Us Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="border-left: 4px solid #4CAF50; padding-left: 10px;">${message}</p>
      </div>
    `;

    // Send email to admin
    await sendEmail(process.env.CONTACT_US_EMAIL, subject, htmlMessage, true);

    // Auto-reply to the user
    const userSubject = "Thank You for Contacting Us!";
    const userMessage = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank you, ${name}!</h2>
        <p>We have received your message and will get back to you shortly.</p>
        <p><strong>Your Message:</strong></p>
        <p style="border-left: 4px solid #4CAF50; padding-left: 10px;">${message}</p>
        <p>Best Regards, <br/> Farm to Market Team</p>
      </div>
    `;

    await sendEmail(email, userSubject, userMessage, true);

  } catch (error) {
    return next(new AppError("Failed to send email. Please try again later.", 500));
  }

  res.status(200).json({
    success: true,
    message: "Your request has been submitted successfully",
  });
};
