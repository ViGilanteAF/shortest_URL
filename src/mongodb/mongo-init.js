db.createUser({
  user: 'dev_user',
  password: 'dev_password',
  roles: [
    {
      role: 'readWrite',
      db: 'dev_database',
    },
  ],
});
