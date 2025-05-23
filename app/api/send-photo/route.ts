import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const { email, photoData, name } = await request.json();

		const data = await resend.emails.send({
			from: 'ONER Photo Booth <photobooth@and-element.io>',
			to: email,
			subject: 'Your ONER Photo Booth Picture',
			attachments: [
				{
					filename: 'photobooth.jpg',
					content: photoData,
					contentType: 'image/jpeg',
				},
			],
			html: `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>OnerActive NY</title>
  <style type="text/css">
    /* RESET */
    html, body { margin:0!important; padding:0!important; height:100%!important; width:100%!important; }
    * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
    .ExternalClass { width:100%; }
    div[style*="margin: 16px 0"] { margin:0!important; }
    table, td { mso-table-lspace:0pt!important; mso-table-rspace:0pt!important; }
    table { border-spacing:0!important; border-collapse:collapse!important; table-layout:fixed!important; margin:0 auto!important; }
    table table table { table-layout:auto; }
    img { -ms-interpolation-mode:bicubic; display:block; margin:0 auto; }
    .yshortcuts a { border-bottom:none!important; }
    a[x-apple-data-detectors] { color:inherit!important; }

    /* PROGRESSIVE */
    .button-td, .button-a { transition: all 100ms ease-in; }
    .button-td:hover, .button-a:hover { background:#555555!important; border-color:#555555!important; }

    @media screen and (max-width:600px) {
      .email-container { width:100%!important; }
      .fluid, .fluid-centered { max-width:100%!important; height:auto!important; margin-left:auto!important; margin-right:auto!important; display:block!important; }
      .stack-column, .stack-column-center { display:block!important; width:100%!important; max-width:100%!important; direction:ltr!important; }
      .stack-column-center { text-align:center!important; }
      .center-on-narrow { text-align:center!important; display:block!important; margin:auto!important; float:none!important; }
      table.center-on-narrow { display:inline-block!important; }
    }
  </style>
</head>
<body bgcolor="#e0e0e0" width="100%" style="margin:0;" yahoo="yahoo">
  <table bgcolor="#e0e0e0" cellpadding="0" cellspacing="0" border="0" height="100%" width="100%">
    <tr>
      <td>
        <center style="width:100%;">

          <!-- Preheader -->
          <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
            Your ONER Photo Booth Picture
          </div>

          <!-- Header -->
          <table align="center" width="600" class="email-container">
            <tr>
              <td style="padding:20px 0; text-align:center;">&nbsp;</td>
            </tr>
          </table>

          <!-- Body -->
          <table align="center" width="600" class="email-container" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">

            <!-- Hero Image -->
            <tr>
              <td class="full-width-image" align="center" style="padding:0;">
                <!--[if mso]>
                <table align="center" cellpadding="0" cellspacing="0" border="0" width="600"><tr><td>
                <![endif]-->
                <img
                  src="https://think-live.s3.eu-west-2.amazonaws.com/01_Zone_1_OA_NY_Header.jpg"
                  width="600"
                  alt="Header"
                  style="display:block; margin:0 auto; width:100%; max-width:600px; height:auto;"
                  class="fluid-centered"
                />
                <!--[if mso]>
                </td></tr></table>
                <![endif]-->
              </td>
            </tr>

            <!-- Intro Text -->
            <tr>
              <td style="padding:40px; text-align:center; font-family:sans-serif; font-size:15px; line-height:20px; color:#555555;">
                <p>Hi ${name},</p>
                <p>Thanks for trying our selfie mirror at the Oner Active Showroom in New York. Here’s your photo! We hope you had a great time at our showroom!</p>
              </td>
            </tr>

            <!-- Spacer/Button Area (if needed) -->
            <tr>
              <td align="center" style="padding:0 20px 40px;">
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                  <tr>
                    <td class="button-td" style="border-radius:3px; background:#222222; text-align:center;">
                      <a
                        href="https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY"
                        class="button-a"
                        style="background:#222222; border:15px solid #222222; padding:0 10px; color:#ffffff; font-family:sans-serif; font-size:13px; line-height:1.1; text-align:center; text-decoration:none; display:block; border-radius:3px; font-weight:300;"
                      >
                        SHOP NOW
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Section with Background Image -->
            <tr>
              <td class="full-width-image" align="center" style="padding:0;">
                <img
                  src="https://think-live.s3.eu-west-2.amazonaws.com/set-the-tone.jpg"
                  width="600"
                  alt="Set the Tone"
                  style="display:block; margin:0 auto; width:100%; max-width:600px; height:auto;"
                  class="fluid-centered"
                />
              </td>
            </tr>

            <!-- Middle Call-to-Action -->
            <tr>
              <td align="center" style="padding:20px; font-family:sans-serif; font-size:15px; line-height:20px; color:#555555;">
                <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                  <tr>
                    <td class="button-td" style="border-radius:3px; background:#222222; text-align:center;">
                      <a
                        href="https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY"
                        class="button-a"
                        style="background:#222222; border:15px solid #222222; padding:0 10px; color:#ffffff; font-family:sans-serif; font-size:13px; line-height:1.1; text-align:center; text-decoration:none; display:block; border-radius:3px; font-weight:300;"
                      >
                        SHOP NOW
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Social Icons -->
            <tr>
              <td align="center" style="padding:40px; background-color:#000000;">
                <a href="https://www.youtube.com/channel/UCsihocLZ7k8l9501v2IDVSg?themeRefresh=1"><img src="https://think-live.s3.eu-west-2.amazonaws.com/youtub.png" width="50" height="50" alt="YouTube" style="display:inline-block; margin:0 5px;"></a>
                <a href="http://facebook.com/oneractive"><img src="https://think-live.s3.eu-west-2.amazonaws.com/faceb.png" width="52" height="50" alt="Facebook" style="display:inline-block; margin:0 5px;"></a>
                <a href="https://www.instagram.com/oneractive"><img src="https://think-live.s3.eu-west-2.amazonaws.com/insta.png" width="50" height="50" alt="Instagram" style="display:inline-block; margin:0 5px;"></a>
                <a href="https://uk.pinterest.com/oneractive/"><img src="https://think-live.s3.eu-west-2.amazonaws.com/pin.png" width="50" height="50" alt="Pinterest" style="display:inline-block; margin:0 5px;"></a>
                <a href="https://www.tiktok.com/@oneractive"><img src="https://think-live.s3.eu-west-2.amazonaws.com/tt.png" width="50" height="50" alt="TikTok" style="display:inline-block; margin:0 5px;"></a>
              </td>
            </tr>

          </table>
          <!-- End Body -->

          <!-- Footer -->
          <table align="center" width="600" class="email-container" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:40px 10px; font-size:12px; font-family:sans-serif; line-height:18px; text-align:center; color:#888888;">
                <p>Copyright © 2025 ONER ACTIVE. All rights reserved.</p>
              </td>
            </tr>
          </table>

        </center>
      </td>
    </tr>
  </table>
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
