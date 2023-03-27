
students = ['student1', 'student2', 'student3', 'teaching_assistant']
student_group = make_group('students', students)
console.log(student_group)

read_perms = [permissions.LIST, permissions.READ_ATTR, permissions.READ_EXTENDED_ATTR, permissions.READ_PERMS] 
read_modify_perms = [permissions.LIST, permissions.READ_ATTR, permissions.READ_EXTENDED_ATTR, permissions.READ_PERMS, permissions.WRITE_DATA, permissions.APPEND_DATA, permissions.WRITE_ATTR, permissions.WRITE_EXTENDED_ATTR, 
    permissions.DELETE, permissions.DELETE_SUB]
modify_perms = [permissions.WRITE_DATA, permissions.APPEND_DATA, permissions.WRITE_ATTR, permissions.WRITE_EXTENDED_ATTR, 
    permissions.DELETE, permissions.DELETE_SUB]

student_perms = make_crossjoin_acl([student_group], read_perms, true)
ta_perms = make_crossjoin_acl(['teaching_assistant', 'professor'], read_modify_perms, true)

root_folder = make_file('C', 'administrator', parent=null, acl=make_full_access_acl('administrator'), using_permission_inheritance=false, is_folder=true);
class_folder = make_file('Lecture_Notes', 'professor', parent=root_folder, acl=student_perms.concat(ta_perms), using_permission_inheritance=true, is_folder=true);
lecture1 = make_file('Lecture1.txt', 'professor', parent=class_folder, acl=[], using_permission_inheritance=true, is_folder=false)
lecture2 = make_file('Lecture2.txt', 'professor', parent=class_folder, acl=[], using_permission_inheritance=false, is_folder=false)
lecture3 = make_file('Lecture3.txt', 'professor', parent=class_folder, acl=[], using_permission_inheritance=false, is_folder=false)
lecture4 = make_file('Lecture4.txt', 'professor', parent=class_folder, acl=[], using_permission_inheritance=true, is_folder=false)

files = [
    root_folder,
    class_folder,
    lecture1,
    lecture2,
    lecture3,
    lecture4,
]