const sendWelcomeEmailTemplete = (Username) => {
  return `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MERN_AUTH</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            text-align: center;
            color: #fff;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            animation: fadeIn 1.5s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        h1 {
            font-weight: 600;
            font-size: 28px;
            margin-bottom: 10px;
        }

        p {
            font-size: 16px;
            font-weight: 300;
            color: #f1f1f1;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            background: #ff6f61;
            color: white;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 8px;
            transition: 0.3s ease-in-out;
            box-shadow: 0 5px 15px rgba(255, 111, 97, 0.3);
        }

        .btn:hover {
            background: #ff4b47;
            box-shadow: 0 8px 20px rgba(255, 75, 71, 0.5);
        }

        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to <span style="color: #ff6f61;">MERN_AUTH</span>, ${Username}!</h1>
        <p>We're excited to have you on board! You can now explore the features of MERN_AUTH.</p>
        <p>Click below to access your dashboard:</p>
        <a href="#" class="btn">Go to Dashboard</a>
        <p class="footer">Best Regards, <br> The MERN_AUTH Team</p>
    </div>
</body>
</html>

      `;

};

export default sendWelcomeEmailTemplete;
