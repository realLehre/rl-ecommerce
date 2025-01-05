// scripts/generate-env.js
const fs = require('fs');
const path = require('path');

function generateEnvironmentFile() {
  // Get environment variables from Netlify
  const environmentContent = `
export const environment = {
  production: ${process.env.CONTEXT === 'production'},
  supabaseUrl: '${process.env.supabaseUrl || ''}',
  supabaseKey: '${process.env.supabaseKey || ''}',
  apiUrl: '${process.env.apiUrl || ''}',
  paystackKey: '${process.env.paystackKey || ''}',
  publicPaystackKey: '${process.env.publicPaystackKey || ''}',
  googleAuthRedirect: '${process.env.googleAuthRedirect || ''}',
};
`;

  // Ensure the environments directory exists
  const envDir = path.join(__dirname, 'apps/rl-ecommerce/src/environments');
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  // Write the environment file
  const filePath = path.join(envDir, 'environment.development.ts');
  fs.writeFileSync(filePath, environmentContent);

  console.log('Environment file generated successfully!');
}

generateEnvironmentFile();
