const bcrypt = require('bcrypt');

async function verifyPassword(){
  const myPassword = 'admin123.as_23';
  const hash = '$2b$10$Cwz.XiZXdHLy4QScEitktO5xfGldrEhkbHNn.sR572aTL2/DH/AAq';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
};

verifyPassword();
