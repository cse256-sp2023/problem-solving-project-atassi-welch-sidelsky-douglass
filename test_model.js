// This is a set of pseudo-unit-tests to make sure that the permissions model is working as intended.
// it can also serve as an example for how to set up files and permissions.

test_group = make_group('test_group', ['test_user2'])

test_acl = [
  make_ace('test_user3', permissions.APPEND_DATA, true),
  make_ace(test_group, permissions.DELETE, true)
]

file_acl = [
  make_ace('test_user3', permissions.APPEND_DATA, true),
  make_ace('test_user3', permissions.WRITE_ATTR, true),
  make_ace('test_user3', permissions.WRITE_EXTENDED_ATTR, true),
  make_ace('test_user3', permissions.CHANGE_PERMS, false),
]

// -- test file structure --
test_folder = make_file('test_folder', 'test_user', parent=null, acl=test_acl, using_permission_inheritance=false, is_folder=true);
test_file = make_file('test_file', 'test_user', parent=test_folder, acl=file_acl, using_permission_inheritance=true, is_folder = false);
test_file2 = make_file('test_file2', 'test_user', parent=test_folder, acl=[], using_permission_inheritance=false, is_folder = false);


console.log('is built-in admin user allowed to change permissions? (should be true)', 
  allow_user_action(test_folder, 'administrator', permissions.CHANGE_PERMS));
console.log('is owner allowed to change permissions? (should be true)', 
  allow_user_action(test_folder, test_folder.owner, permissions.CHANGE_PERMS));

console.log('is user explicitly added to ACL allowed to append data? (should be true)',
  allow_user_action(test_folder, 'test_user3', permissions.APPEND_DATA))
console.log('is user who is part of delete-enabled group allowed to delete data? (should be true)',
  allow_user_action(test_folder, 'test_user2', permissions.DELETE))


console.log('is user without any permissions allowed to read data? (should be false)',
  allow_user_action(test_folder, 'foo_user', permissions.LIST))

console.log('are user permissions propagated through inheritance? (should be true)',
allow_user_action(test_file, 'test_user3', permissions.APPEND_DATA))

console.log('is inheritance in effect when not turned on? (should be false)',
allow_user_action(test_file2, 'test_user3', permissions.APPEND_DATA))