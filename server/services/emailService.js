import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

export const sendNewBookingAlertToOwner = async (booking) => {
  const ownerEmail = process.env.BUSINESS_EMAIL || 'owner@velvetsmoke-rentals.com';
  const subject = `🔥 NEW BOOKING REQUEST: #${booking.bookingReference} - ${booking.customer.fullName}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0c10; color: #e0e0e0; padding: 24px; border-radius: 8px;">
      <h2 style="color: #d4af37; margin-bottom: 8px;">Velvet Smoke - Luxury Hookah Rentals</h2>
      <h3 style="color: #ffffff; border-bottom: 1px solid #333; padding-bottom: 12px;">New Booking Submission Alert</h3>
      
      <p><strong>Booking Ref:</strong> <span style="color: #f59e0b; font-weight: bold;">${booking.bookingReference}</span></p>
      <p><strong>Customer:</strong> ${booking.customer.fullName} (${booking.customer.email} | ${booking.customer.phone})</p>
      <p><strong>Event Type:</strong> ${booking.eventDetails.eventType}</p>
      <p><strong>Date & Time:</strong> ${new Date(booking.eventDetails.eventDate).toLocaleDateString()} at ${booking.eventDetails.startTime}</p>
      <p><strong>Duration:</strong> ${booking.eventDetails.durationHours} Hours</p>
      <p><strong>Venue Address:</strong> ${booking.eventDetails.venueAddress}</p>
      <p><strong>Estimated Total:</strong> <span style="color: #10b981; font-weight: bold;">$${booking.pricing.estimatedTotal}</span></p>
      <p><strong>Hookahs Requested:</strong> ${booking.items.map((i) => `${i.title} (${i.quantity}x)`).join(', ')}</p>
      
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #333;">
        <p style="color: #888; font-size: 12px;">Log in to your Admin Dashboard to confirm or modify this booking.</p>
      </div>
    </div>
  `;

  console.log(`\n================ EMAIL NOTIFICATION TO OWNER ================`);
  console.log(`To: ${ownerEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Booking Ref: ${booking.bookingReference} | Total: $${booking.pricing.estimatedTotal}`);
  console.log(`=============================================================\n`);

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: '"Velvet Smoke VIP" <noreply@velvetsmoke-rentals.com>',
        to: ownerEmail,
        subject,
        html: htmlContent,
      });
    }
  } catch (err) {
    console.error('Failed to send SMTP email to owner:', err.message);
  }
};

export const sendBookingReceiptToCustomer = async (booking) => {
  const subject = `✨ Booking Request Received - Reference #${booking.bookingReference}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0c10; color: #e0e0e0; padding: 24px; border-radius: 8px;">
      <h2 style="color: #d4af37; margin-bottom: 8px;">Velvet Smoke - Luxury Hookah Rentals</h2>
      <p style="color: #cccccc;">Dear ${booking.customer.fullName},</p>
      <p>Thank you for submitting your hookah rental request with Velvet Smoke. We have received your order details and our concierge team is currently reviewing availability for your event date.</p>
      
      <div style="background-color: #16181f; padding: 16px; border-left: 4px solid #d4af37; border-radius: 4px; margin: 20px 0;">
        <h4 style="color: #ffffff; margin-top: 0;">Reservation Summary</h4>
        <p><strong>Reference Number:</strong> <span style="color: #f59e0b;">${booking.bookingReference}</span></p>
        <p><strong>Event Type:</strong> ${booking.eventDetails.eventType}</p>
        <p><strong>Date & Time:</strong> ${new Date(booking.eventDetails.eventDate).toLocaleDateString()} @ ${booking.eventDetails.startTime}</p>
        <p><strong>Duration:</strong> ${booking.eventDetails.durationHours} Hours</p>
        <p><strong>Estimated Total:</strong> $${booking.pricing.estimatedTotal}</p>
        <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending Concierge Confirmation</span></p>
      </div>

      <p style="color: #aaa; font-size: 14px;">Please note: Payment will be arranged upon confirmation of your booking by our team. No payment is required at this moment.</p>
      <p style="color: #d4af37; font-weight: bold;">Velvet Smoke VIP Concierge Team</p>
    </div>
  `;

  console.log(`\n================ EMAIL RECEIPT TO CUSTOMER ==================`);
  console.log(`To: ${booking.customer.email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Ref: ${booking.bookingReference}`);
  console.log(`=============================================================\n`);

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: '"Velvet Smoke VIP" <noreply@velvetsmoke-rentals.com>',
        to: booking.customer.email,
        subject,
        html: htmlContent,
      });
    }
  } catch (err) {
    console.error('Failed to send SMTP email to customer:', err.message);
  }
};

export const sendStatusUpdateToCustomer = async (booking) => {
  const subject = `Update on your Booking #${booking.bookingReference} - Status: ${booking.status}`;

  const statusColor = booking.status === 'Confirmed' ? '#10b981' : booking.status === 'Cancelled' ? '#ef4444' : '#3b82f6';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0b0c10; color: #e0e0e0; padding: 24px; border-radius: 8px;">
      <h2 style="color: #d4af37;">Velvet Smoke - Luxury Hookah Rentals</h2>
      <p>Hello ${booking.customer.fullName},</p>
      <p>The status of your booking request <strong>#${booking.bookingReference}</strong> has been updated to:</p>
      
      <div style="font-size: 20px; font-weight: bold; color: ${statusColor}; margin: 16px 0;">
        STATUS: ${booking.status.toUpperCase()}
      </div>

      ${booking.adminNotes ? `<p><strong>Note from Concierge:</strong> ${booking.adminNotes}</p>` : ''}

      <p style="margin-top: 20px;">If you have any questions, please reply directly to this email or contact our support team.</p>
      <p style="color: #d4af37;">Velvet Smoke Team</p>
    </div>
  `;

  console.log(`\n================ STATUS UPDATE EMAIL =======================`);
  console.log(`To: ${booking.customer.email} | Status: ${booking.status}`);
  console.log(`=============================================================\n`);

  try {
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: '"Velvet Smoke VIP" <noreply@velvetsmoke-rentals.com>',
        to: booking.customer.email,
        subject,
        html: htmlContent,
      });
    }
  } catch (err) {
    console.error('Failed to send SMTP status email:', err.message);
  }
};
