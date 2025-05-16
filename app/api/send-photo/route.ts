import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const { email, photoData, name } = await request.json();

		console.log('Received data:', { email, photoData, name });

		const data = await resend.emails.send({
			from: 'ONER Photo Booth <photobooth@and-element.io>',
			to: email,
			subject: 'Your ONER Photo Booth Picture',
			html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your ONER Photo</title>
          </head>
          <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: white;">
              <img src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75" 
                   alt="ONER" 
                   style="display: block; height: 50px; margin: 0 auto 30px;"
              />
              
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hi ${name}!</h1>
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Thank you for visiting the ONER Photo Booth. Here's your photo:
              </p>
              
              <img src="data:image/jpeg;base64,${photoData}" 
                   alt="Your photo" 
                   style="display: block; width: 100%; max-width: 400px; margin: 0 auto 30px; border: 20px solid black;"
              />
              
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Visit our website to explore our latest collection and find your perfect fit.
              </p>
              
              <a href="https://www.oneractive.com" 
                 style="display: inline-block; background: #1a1a1a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: 500;">
                Shop Now
              </a>
            </div>
          </body>
        </html>
      `,
		});

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error('Email error:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to send email' },
			{ status: 500 }
		);
	}
}
