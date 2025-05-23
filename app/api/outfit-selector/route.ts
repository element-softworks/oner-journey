import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const { email, name } = await request.json();

		const data = await resend.emails.send({
			from: 'ONER Prize Draw Entry <photobooth@and-element.io>',
			to: email,
			subject: 'Your ONER Prize Draw Entry',
			html: `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>OnerActive NY</title>
  <style type="text/css">
    /* Reset */
    html, body { margin:0!important; padding:0!important; width:100%!important; height:100%!important; }
    * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
    .ExternalClass { width:100%; }
    div[style*="margin: 16px 0"] { margin:0!important; }
    table, td { mso-table-lspace:0pt!important; mso-table-rspace:0pt!important; }
    table { border-spacing:0!important; border-collapse:collapse!important; table-layout:fixed!important; margin:0 auto!important; }
    table table table { table-layout:auto; }
    img { -ms-interpolation-mode:bicubic; display:block; margin:0 auto; }
    a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; }
    /* Button hover */
    .button-td, .button-a { transition: all 100ms ease-in; }
    .button-td:hover, .button-a:hover { background:#555!important; border-color:#555!important; }
    /* Responsive */
    @media screen and (max-width:600px) {
      .email-container { width:100%!important; }
      .fluid, .fluid-centered { max-width:100%!important; height:auto!important; margin:0 auto!important; }
      .stack-column, .stack-column-center { display:block!important; width:100%!important; max-width:100%!important; }
      .stack-column-center { text-align:center!important; }
      .center-on-narrow { text-align:center!important; display:block!important; margin:0 auto!important; float:none!important; }
      table.center-on-narrow { display:inline-block!important; }
    }
  </style>
</head>
<body bgcolor="#e0e0e0" width="100%" style="margin:0;" yahoo="yahoo">

  <table bgcolor="#e0e0e0" cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
    <tr>
      <td>
        <center style="width:100%;">

          <!-- Preheader -->
          <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
            Oner Active NY - Your ONER Prize Draw Entry
          </div>

          <!-- Header Spacer -->
          <table align="center" width="600" class="email-container">
            <tr><td style="padding:20px 0;text-align:center;">&nbsp;</td></tr>
          </table>

          <!-- Body Container -->
          <table align="center" width="600" class="email-container" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0">

            <!-- Hero Image -->
            <tr>
              <td align="center" class="full-width-image">
                <img
                  src="https://think-live.s3.eu-west-2.amazonaws.com/01_Zone_1_OA_NY_Header.jpg"
                  width="600"
                  alt="Hero"
                  class="fluid-centered"
                  style="width:100%; max-width:600px; height:auto;"
                >
              </td>
            </tr>

            <!-- Intro Text -->
            <tr>
              <td style="padding:40px; text-align:center; font-family:sans-serif; font-size:15px; line-height:20px; color:#555;">
                <p>Hi ${name},</p>
                <p>This is a quick email to confirm you’ve entered our competition to win your chosen fit for free!</p>
                <p>We’ll email our lucky winners soon. In the meantime, click below to browse our website.</p>

                <!-- Button -->
                <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto;">
                  <tr>
                    <td class="button-td" style="border-radius:3px; background:#222; text-align:center;">
                      <a
                        class="button-a"
                        href="https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY"
                        style="background:#222; border:15px solid #222; padding:0 10px; color:#fff; font-family:sans-serif; font-size:13px; line-height:1.1; text-decoration:none; display:block; border-radius:3px;"
                      >
                        SHOP NEW IN
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Secondary Hero -->
            <tr>
              <td align="center" class="full-width-image">
                <img
                  src="https://think-live.s3.eu-west-2.amazonaws.com/set-the-tone.jpg"
                  width="600"
                  alt="Set the Tone"
                  class="fluid-centered"
                  style="width:100%; max-width:600px; height:auto;"
                >
              </td>
            </tr>

            <!-- Another Button (if needed) -->
            <tr>
              <td style="padding:20px; text-align:center; font-family:sans-serif; font-size:15px; line-height:20px; color:#555;">
                <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto;">
                  <tr>
                    <td class="button-td" style="border-radius:3px; background:#222; text-align:center;">
                      <a
                        class="button-a"
                        href="https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY"
                        style="background:#222; border:15px solid #222; padding:0 10px; color:#fff; font-family:sans-serif; font-size:13px; line-height:1.1; text-decoration:none; display:block; border-radius:3px;"
                      >
                        SHOP NOW
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- (Optional) Thumbnail Row -->
            <!--
            <tr>
              <td align="center" valign="top" style="padding:10px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>
                    <td width="33.33%" class="stack-column-center">
                      <img src="..." width="180" alt="..." style="display:block; margin:0 auto; max-width:100%; height:auto;">
                    </td>
                    <td width="33.33%" class="stack-column-center">
                      <img src="..." width="180" alt="..." style="display:block; margin:0 auto; max-width:100%; height:auto;">
                    </td>
                    <td width="33.33%" class="stack-column-center">
                      <img src="..." width="180" alt="..." style="display:block; margin:0 auto; max-width:100%; height:auto;">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            -->

            <!-- Social Footer -->
            <tr>
              <td align="center" bgcolor="#000" style="padding:40px;">
                <a href="https://www.youtube.com/channel/UCsihocLZ7k8l9501v2IDVSg?themeRefresh=1"><img src="https://think-live.s3.eu-west-2.amazonaws.com/youtub.png" width="50" height="50" alt="YouTube" style="display:inline-block; margin:0 5px;"></a>
                <a href="http://facebook.com/oneractive"><img src="https://think-live.s3.eu-west-2.amazonaws.com/faceb.png" width="52" height="50" alt="Facebook" style="display:inline-block; margin:0 5px;"></a>
                <a href="https://www.instagram.com/oneractive"><img src="https://think-live.s3.eu-west-2.amazonaws.com/insta.png" width="50" height="50" alt="Instagram" style="display:inline-block; margin:0 5px;"></a>
                <a href="https://uk.pinterest.com/oneractive/"><img src="https://think-live.s3.eu-west-2.amazonaws.com/pin.png" width="50" height="50" alt="Pinterest" style="display:inline-block; margin:0 5px;"></a>
                <a href="https://www.tiktok.com/@oneractive"><img src="https://think-live.s3.eu-west-2.amazonaws.com/tt.png" width="50" height="50" alt="TikTok" style="display:inline-block; margin:0 5px;"></a>
              </td>
            </tr>

          </table>

          <!-- Footer Legal -->
          <table align="center" width="600" class="email-container">
            <tr>
              <td style="padding:40px 10px; font-family:sans-serif; font-size:12px; line-height:18px; text-align:center; color:#888;">
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
