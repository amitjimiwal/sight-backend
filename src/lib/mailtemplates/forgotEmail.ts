export  function forgotEmail(name:string,link:string | undefined){
     return `<!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <link rel="stylesheet" href="style.css" />
       <title>Reset Password</title>
     </head>
     <body>
       <h1>
         Hii ${name},
       </h1>
       <p>
         You can reset your password using this link &nbsp;<a href=${link} target="_blank" referror="noreferrer">link</a>
       </p>
       <p>It'll be valid for 10 mins from now..</p>
     </body>
     </html>`
}