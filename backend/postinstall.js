// simple-postinstall.js
// A minimal version that only focuses on the Medusa admin user creation

const { execSync } = require('child_process');

// Check if we should add a Medusa admin user
const shouldAddAdmin = process.env.ADD_ADMIN === 'true';

try {
  if (shouldAddAdmin) {
    console.log('ADD_ADMIN=true detected. Creating Medusa admin user...');
    
    // You can customize the email and password here or use environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'willytheigeek@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'supersecret';
    
    execSync(`npx medusa user -e ${adminEmail} -p ${adminPassword}`, { 
      stdio: 'inherit',
      env: process.env  // Pass environment variables to the child process
    });
    
    console.log('Medusa admin user created successfully!');
  } else {
    console.log('Skipping Medusa admin user creation (ADD_ADMIN is not set to true)');
  }
  
  console.log('Postinstall tasks completed successfully!');
} catch (error) {
  console.error('Postinstall script failed:');
  console.error(error);
  process.exit(1);
}
