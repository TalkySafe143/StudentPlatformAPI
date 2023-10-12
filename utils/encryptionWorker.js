function checkSQLEntry(entry) {
  const onlyLettersPattern = /^[A-Za-z0-9]+$/;
  // SQL injection
  for (const [key, value] of Object.entries(entry)) {
      if (key.toUpperCase().includes("SELECT")
          || key.toUpperCase().includes("DELETE")
          || key.toUpperCase().includes("INSERT")
          || key.toUpperCase().includes("UPDATE")
          || value.toUpperCase().includes("SELECT")
          || value.toUpperCase().includes("DELETE")
          || value.toUpperCase().includes("INSERT")
          || value.toUpperCase().includes("UPDATE")
          || !key.match(onlyLettersPattern)
          || !value.match(onlyLettersPattern)) {
          return true;
      }
  }

  return false;
}

module.exports = { checkSQLEntry };