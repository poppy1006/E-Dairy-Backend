export const login_credentials = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Credentials</title>
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

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            margin-bottom: 10px;
        }

        strong {
            color: #45108a;
        }

        hr {
            border: 1px solid #e0e0e0;
            margin: 20px 0;
        }

        .footer {
            background-color: #007bff;
            color: #fff;
            padding: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <table role="presentation" align="center">
        <tr>
            <td>
                <p>Hello <$name$>,</p>
                <p>Your user credentials for Swathantra are provided below:</p>
                <ul>
                    <li><strong>Username:</strong> <b><$email$></b></li>
                    <li><strong>Password:</strong> <b><$password$></b></li>
                </ul>
                <p>Please keep your credentials safe and do not share them with anyone.</p>
                <hr>
                <p>Use the above credentials to login into Swathrantra.</p>
                <p>Best regards,<br>Swathrantra</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;
