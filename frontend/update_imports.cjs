const fs = require('fs');
const path = require('path');
const dirs = ['admin', 'company', 'student', 'common'];
const basePath = 'c:/Users/ASUS/Desktop/FiveCore_Jobportal/frontend/src/pages';
dirs.forEach(d => {
  const dirPath = path.join(basePath, d);
  if (!fs.existsSync(dirPath)) return;
  fs.readdirSync(dirPath).forEach(f => {
    if (f.endsWith('.jsx')) {
      let fPath = path.join(dirPath, f);
      let content = fs.readFileSync(fPath, 'utf8');
      content = content.replace(/from\s+['"]\.\.\/components/g, "from '../../components");
      content = content.replace(/from\s+['"]\.\.\/api['"]/g, "from '../../api'");
      content = content.replace(/from\s+['"]\.\.\/config/g, "from '../../config");
      content = content.replace(/import\s+['"]\.\/([^'"]+\.css)['"]/g, "import '../../assets/css/$1'");
      fs.writeFileSync(fPath, content);
      console.log('Updated', fPath);
    }
  });
});
console.log('Update complete');
