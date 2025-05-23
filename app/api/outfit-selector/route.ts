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
    <!-- utf-8 works for most cases -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Forcing initial-scale shouldn't be necessary -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Use the latest (edge) version of IE rendering engine -->
    <title>OnerActive NY</title>
    <!-- The title tag shows in email notifications, like Android 4.4. -->
    <!-- Please use an inliner tool to convert all CSS to inline as inpage or external CSS is removed by email clients -->
    <!-- important in CSS is used to prevent the styles of currently inline CSS from overriding the ones mentioned in media queries when corresponding screen sizes are encountered -->

    <!-- CSS Reset -->
    <style type="text/css">
/* What it does: Remove spaces around the email design added by some email clients. */
      /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
html,  body {
	margin: 0 !important;
	padding: 0 !important;
	height: 100% !important;
	width: 100% !important;
}
/* What it does: Stops email clients resizing small text. */
* {
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
}
/* What it does: Forces Outlook.com to display emails full width. */
.ExternalClass {
	width: 100%;
}
/* What is does: Centers email on Android 4.4 */
div[style*="margin: 16px 0"] {
	margin: 0 !important;
}
/* What it does: Stops Outlook from adding extra spacing to tables. */
table,  td {
	mso-table-lspace: 0pt !important;
	mso-table-rspace: 0pt !important;
}
/* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
table {
	border-spacing: 0 !important;
	border-collapse: collapse !important;
	table-layout: fixed !important;
	margin: 0 auto !important;
}
table table table {
	table-layout: auto;
}
/* What it does: Uses a better rendering method when resizing images in IE. */
img {
	-ms-interpolation-mode: bicubic;
}
/* What it does: Overrides styles added when Yahoo's auto-senses a link. */
.yshortcuts a {
	border-bottom: none !important;
}
/* What it does: Another work-around for iOS meddling in triggered links. */
a[x-apple-data-detectors] {
	color: inherit !important;
}
</style>

    <!-- Progressive Enhancements -->
    <style type="text/css">
        
        /* What it does: Hover styles for buttons */
        .button-td,
        .button-a {
            transition: all 100ms ease-in;
        }
        .button-td:hover,
        .button-a:hover {
            background: #555555 !important;
            border-color: #555555 !important;
        }

        /* Media Queries */
        @media screen and (max-width: 600px) {

            .email-container {
                width: 100% !important;
            }

            /* What it does: Forces elements to resize to the full width of their container. Useful for resizing images beyond their max-width. */
            .fluid,
            .fluid-centered {
                max-width: 100% !important;
                height: auto !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }
            /* And center justify these ones. */
            .fluid-centered {
                margin-left: auto !important;
                margin-right: auto !important;
            }

            /* What it does: Forces table cells into full-width rows. */
            .stack-column,
            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }
            /* And center justify these ones. */
            .stack-column-center {
                text-align: center !important;
            }
        
            /* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
            .center-on-narrow {
                text-align: center !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
                float: none !important;
            }
            table.center-on-narrow {
                display: inline-block !important;
            }
                
        }

    </style>
    </head>
    <body bgcolor="#e0e0e0" width="100%" style="margin: 0;" yahoo="yahoo">
    <table bgcolor="#e0e0e0" cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" style="border-collapse:collapse;">
      <tr>
        <td><center style="width: 100%;">
            
            <!-- Visually Hidden Preheader Text : BEGIN -->
            <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> (Optional) This text will appear in the inbox preview, but not the email body. </div>
            <!-- Visually Hidden Preheader Text : END --> 
            
            <!-- Email Header : BEGIN -->
            <table align="center" width="600" class="email-container">
            <tr>
                <td style="padding: 20px 0; text-align: center">&nbsp;</td>
              </tr>
          </table>
            <!-- Email Header : END --> 
            
            <!-- Email Body : BEGIN -->
            <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="600" class="email-container">
            
            <!-- Hero Image, Flush : BEGIN -->
            <tr>
                <td class="full-width-image"><img src="https://think-live.s3.eu-west-2.amazonaws.com/01_Zone_1_OA_NY_Header.jpg" width="600" alt="alt_text" border="0" align="center" style="width: 100%; max-width: 600px; height: auto;"></td>
              </tr>
            <!-- Hero Image, Flush : END --> 
            
            <!-- 1 Column Text : BEGIN -->
            <tr>
                <td style="padding: 40px; text-align: center; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Hi [NAME]&nbsp;</p>
                  <p> This is a quick email to confirm you’ve entered our competition to win your chosen fit for free!&nbsp;</p>
                  <p>We’ll send our lucky winners an email – keep a lookout in your inbox. In the meantime, click below to browse our website. <br>
                    <br>
                    <!-- Button : Begin -->
					  
                  </p>
<table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto">
	<td style="border-radius: 3px; background: #222222; text-align: center;" class="button-td"><a href="https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY" style="background: #222222; border: 15px solid #222222; padding: 0 10px;color: #ffffff; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: light;" class="button-a"> 
                      SHOP NEW IN<br>
                    </a></td>
                  <tr>
                   
                    </a></td>
                  </tr>
                  </table>
                
                <!-- Button : END --></td>
              </tr>
            <!-- 1 Column Text : BEGIN --> 
            
            <!-- Background Image with Text : BEGIN -->
            <tr>
                <td class="full-width-image"><img src="https://think-live.s3.eu-west-2.amazonaws.com/set-the-tone.jpg" width="600" alt="alt_text" border="0" align="center" style="width: 100%; max-width: 600px; height: auto;"><!--[if gte mso 9]>
                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:175px; background-position: center center !important;">
                    <v:fill type="tile" src="assets/Responsive/Image_600x230.png" color="#222222" />
                    <v:textbox inset="0,0,0,0">
                    <![endif]-->
                
                <div>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                       
                      </tr>
                  </table>
                  </div>
                
                <!--[if gte mso 9]>
                    </v:textbox>
                    </v:rect>
                    <![endif]--></td>
              </tr>
            <!-- Background Image with Text : END --> 
             <td style="padding: 20px; text-align: center; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 0px; color: #555555;"> <br>
                    <br>
                    <!-- Button : Begin -->
                  </p>
<table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto">
                  <tr>
                    <td style="border-radius: 3px; background: #222222; text-align: center;" class="button-td"><a href="https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY" style="background: #222222; border: 15px solid #222222; padding: 0 10px;color: #ffffff; font-family: sans-serif; font-size: 13px; line-height: 1.1; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: light;" class="button-a"> 
                      SHOP NOW<br>
                    </a></td>
                  </tr>
                  </table>
           
            
           
            
            <!-- Thumbnail Left, Text Right : BEGIN -->
            <tr>
                <td dir="ltr" align="center" valign="top" width="100%" style="padding: 10px;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                    <td width="33.33%" class="stack-column-center"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                    
                      </tr>
                      </table></td>
               
                            
                           
                  </tr>
                  </table></td>
              </tr>
            <!-- 1 Column Text : BEGIN --> 
            
            <!-- Background Image with Text : BEGIN -->
            <tr>
                <td background bgcolor="#000000" valign="middle" style="text-align: center; background-position: center center !important; background-size: cover !important;"><!--[if gte mso 9]>
                    <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:175px; background-position: center center !important;">
                    <v:fill type="tile" src="assets/Responsive/Image_600x230.png" color="#222222" />
                    <v:textbox inset="0,0,0,0">
                    <![endif]-->
                
                <div>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td valign="middle" style="text-align: center; padding: 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #ffffff;"><a href="http://www.youtube.com"></a><img src="https://think-live.s3.eu-west-2.amazonaws.com/youtub.png" width="50" height="50" alt=""/></a><img src="https://think-live.s3.eu-west-2.amazonaws.com/faceb.png" width="52" height="50" alt=""/><img src="https://think-live.s3.eu-west-2.amazonaws.com/insta.png" width="50" height="50" alt=""/><img src="https://think-live.s3.eu-west-2.amazonaws.com/pin.png" width="50" height="50" alt=""/><img src="https://think-live.s3.eu-west-2.amazonaws.com/tt.png" width="50" height="50" alt=""/></td>
                      </tr>
                  </table>
                  </div>
                
                <!--[if gte mso 9]>
                    </v:textbox>
                    </v:rect>
                    <![endif]--></td>
              </tr>
            <!-- Background Image with Text : END -->
          </table>
            <!-- Email Body : END --> 
			
            
            <!-- Email Footer : BEGIN -->
            <table align="center" width="600" class="email-container">
            <tr>
                <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;"><webversion style="color:#cccccc; text-decoration:underline; font-weight: bold;">&nbsp;</webversion>
                  <p> 
                    <br>
                   
                  <p><span class="mobile-link--footer">Copyright © 2025 ONER ACTIVE. All rights reserved.</span> <br>
                    <br>
                  </p>
            
              </tr>
          </table>
            <!-- Email Footer : END -->
            
          </center></td>
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
