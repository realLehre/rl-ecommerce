export const environment = {
  production: true,
  supabaseUrl: process.env['supabaseUrl'],
  supabaseKey: process.env['supabaseKey'],
  // apiUrl: 'https://rl-ecommerce-api.onrender.com/api/',
  apiUrl: process.env['apiUrl'],
  paystackKey: process.env['paystackKey'],
  publicPaystackKey: process.env['publicPaystackKey'],
  googleAuthRedirect: process.env['googleAuthRedirect'],
};
