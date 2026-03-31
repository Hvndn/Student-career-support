const fs = require('fs');
const path = require('path');
const dirs = ['admin', 'auth', 'company', 'student', 'common'];
const basePath = 'c:/Users/ASUS/Desktop/FiveCore_Jobportal/jobportal/src/main/java/com/fivecore/jobportal/controller/api';
dirs.forEach(d => {
  const dirPath = path.join(basePath, d);
  if (!fs.existsSync(dirPath)) return;
  fs.readdirSync(dirPath).forEach(f => {
    if (f.endsWith('.java')) {
      let fPath = path.join(dirPath, f);
      let content = fs.readFileSync(fPath, 'utf8');
      content = content.replace(/^package com\.fivecore\.jobportal\.controller\.api;/gm, `package com.fivecore.jobportal.controller.api.${d};`);
      fs.writeFileSync(fPath, content);
      console.log('Updated ' + fPath);
    }
  });
});
console.log('Backend packages updated.');
