employees = ['employee1', 'employee2']

read_perms = [permissions.LIST, permissions.READ_ATTR, permissions.READ_EXTENDED_ATTR, permissions.READ_PERMS] 
read_modify_perms = [permissions.LIST, permissions.READ_ATTR, permissions.READ_EXTENDED_ATTR, permissions.READ_PERMS, permissions.WRITE_DATA, permissions.APPEND_DATA, permissions.WRITE_ATTR, permissions.WRITE_EXTENDED_ATTR, 
    permissions.DELETE, permissions.DELETE_SUB] 

employee_acl = make_crossjoin_acl(employees, read_modify_perms, true)
intern_acl = make_crossjoin_acl(['intern'], read_perms, true)

root_folder = make_file('C', 'administrator', parent=null, acl=make_full_access_acl('administrator'), using_permission_inheritance=false, is_folder=true);
project = make_file('important_project', 'employee1', parent=root_folder, acl=employee_acl.concat(intern_acl), using_permission_inheritance=true, is_folder=true);
file1 = make_file('project_file_1.txt', 'employee1', parent=project, acl=[], using_permission_inheritance=true, is_folder=false);
file2 = make_file('project_file_2.txt', 'employee1', parent=project, acl=[], using_permission_inheritance=true, is_folder=false);
intern_folder = make_file('intern_subproject', 'employee2', parent=project, acl=[], using_permission_inheritance=true, is_folder=true);
internfile1 = make_file('internship_file_1.txt', 'employee2', parent=intern_folder, acl=[], using_permission_inheritance=true, is_folder=false);
internfile2 = make_file('internship_file_2.txt', 'employee2', parent=intern_folder, acl=[], using_permission_inheritance=true, is_folder=false);

files = [
    root_folder,
    project,
    file1,
    file2,
    intern_folder,
    internfile1,
    internfile2
]