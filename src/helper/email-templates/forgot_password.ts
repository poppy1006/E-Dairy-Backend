export const forgot_password = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: auto;
            max-width: 600px;
            border: 1px solid #e0e0e0;
            background-color: #fff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        td {
            padding: 20px;
            text-align: left;
        }

        img {
            display: block;
            margin: 0 auto;
            width: 150px;
            padding:20px;
        }

        p {
            margin: 0 0 20px;
            font-size: 16px;
            line-height: 1.6;
        }

        h3 {
            color: #455056;
            font-size: 20px;
            line-height: 24px;
            margin-bottom: 0;
            margin-top: 10px;
            text-align: center;
        }

        span.button {
            background: linear-gradient(150deg, #45108a, #f15769 300%);
            text-decoration: none !important;
            font-weight: bolder;
            margin-top: 20px;
            color: white;
            text-transform: uppercase;
            font-size: 16px;
            padding: 15px 30px;
            display: inline-block;
            border-radius: 10px;
            align-items: center;
            justify-content: center;
            text-align: center;
            margin-bottom:10px;
        }
    </style>
</head>
<body>
    <table role="presentation" align="center">
        <tr>
            <td>
                <p>Hello <$name$>,</p>
                <p>Hey, we received a request to reset your password.</p>
                <h3>Here is your OTP
                <br/>
                <span class="button"><$OTP$></span>
                </h3>
                
                <p>Use the above OTP to reset your password.</p>
                <hr>
                <p>Didn’t request a password reset? You can ignore this message.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;
