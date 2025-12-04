import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { studentService } from "@/services/student.service";
import { useToast } from "@/hooks/use-toast";

const StudentManagement = () => {
  const { toast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [selectedId, setSelectedId] = useState(null);

  // Applications
  const [allApps, setAllApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]);

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await studentService.getStudents({ page, limit, search });

      setStudents(Array.isArray(res.data) ? res.data : []);
      setTotal(res.total || 0);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load students",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load on page/search change
  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  // FORM INPUT HANDLER
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // CREATE STUDENT
  const createStudent = async () => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        appIds: selectedApps,
      };

      const res = await studentService.createStudent(payload);

      if (res.success) {
        toast({
          title: "Success",
          description: "Student created successfully",
        });

        setOpenModal(false);
        fetchStudents();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: res.message || "Could not create student",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  // UPDATE STUDENT
  const updateStudent = async () => {
    try {
      setSaving(true);

      await studentService.updateStudent(selectedId, form);
      await studentService.updateUserApplications(selectedId, selectedApps);

      toast({
        title: "Updated",
        description: "Student updated successfully",
      });

      setOpenModal(false);
      fetchStudents();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update student",
      });
    } finally {
      setSaving(false);
    }
  };

  // DELETE STUDENT
  const deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      setLoading(true);
      await studentService.deleteStudent(id);

      toast({
        title: "Deleted",
        description: "Student deleted successfully",
      });

      fetchStudents();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student",
      });
    } finally {
      setLoading(false);
    }
  };

  // REINVITE STUDENT
  const reinviteStudent = async (email) => {
    try {
      setLoading(true);

      await studentService.sendInvite(email);

      toast({
        title: "Invitation Sent",
        description: "Password setup link sent again.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not send invitation",
      });
    } finally {
      setLoading(false);
    }
  };

  // OPEN CREATE MODAL
  const openCreateModal = async () => {
    setEditMode(false);

    const res = await studentService.getAllApplications();
    const appsArray = Array.isArray(res.data) ? res.data : [];

    setAllApps(appsArray);
    setSelectedApps(appsArray.map((a) => a.id));

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });

    setOpenModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = async (student) => {
    setEditMode(true);
    setSelectedId(student.id);

    const resApps = await studentService.getAllApplications();
    const appsArray = Array.isArray(resApps.data) ? resApps.data : [];
    setAllApps(appsArray);

    const resUserApps = await studentService.getUserApplications(student.id);
    const userAppsArray = Array.isArray(resUserApps.data)
      ? resUserApps.data
      : [];
    setSelectedApps(userAppsArray.map((a) => a.applicationId));

    setForm({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email,
      phoneNumber: student.phoneNumber || "",
    });

    setOpenModal(true);
  };

  // TOTAL PAGES
  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <Button onClick={openCreateModal}>+ Add Student</Button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          className="border p-2 rounded w-full max-w-sm mb-4"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* STUDENT TABLE */}
        <div className="bg-white rounded shadow p-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="p-3">{s.email}</td>
                      <td className="p-3">{s.phoneNumber || "-"}</td>

                      <td className="p-3 flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => openEditModal(s)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="default"
                          onClick={() => reinviteStudent(s.email)}
                        >
                          Reinvite
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => deleteStudent(s.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="flex items-center justify-center mt-4 gap-2">
                {/* Prev */}
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-1 rounded border ${
                        page === num
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                {/* Next */}
                <Button
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>

        {/* CREATE / EDIT MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow max-w-lg w-full space-y-4">
              <h2 className="text-xl font-semibold">
                {editMode ? "Edit Student" : "Add Student"}
              </h2>

              {/* FORM */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="border p-2 rounded"
                  placeholder="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
                <input
                  className="border p-2 rounded col-span-2"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={editMode}
                />
                <input
                  className="border p-2 rounded col-span-2"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              {/* APPLICATIONS */}
              <div className="border rounded p-3">
                <h3 className="font-semibold mb-2">Applications</h3>

                <div className="grid grid-cols-2 gap-2">
                  {allApps.map((app) => (
                    <label key={app.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedApps.includes(app.id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;

                          if (!isChecked && selectedApps.length === 1) {
                            toast({
                              variant: "destructive",
                              title: "At least one app required",
                              description:
                                "A student must be assigned to at least one application.",
                            });
                            return;
                          }

                          if (isChecked) {
                            setSelectedApps([...selectedApps, app.id]);
                          } else {
                            setSelectedApps(
                              selectedApps.filter((id) => id !== app.id)
                            );
                          }
                        }}
                      />
                      {app.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>

                <Button
                  disabled={saving}
                  onClick={editMode ? updateStudent : createStudent}
                >
                  {saving ? "Please wait..." : editMode ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentManagement;
