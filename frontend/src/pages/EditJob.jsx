import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobApi } from "../api";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    salary: "",
    description: "",
  });

  // load dữ liệu job
  useEffect(() => {
    jobApi.getById(id).then(res => {
      setJob(res.data.data);
    });
  }, [id]);

  // handle input
  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await jobApi.update(id, job);
      alert("Cập nhật thành công!");
      navigate("/company/dashboard");
    } catch (err) {
      alert("Lỗi cập nhật!");
    }
  };

  return (
    <div className="container">
      <h2>Sửa tin tuyển dụng</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Tiêu đề"
        />

        <input
          name="salary"
          value={job.salary}
          onChange={handleChange}
          placeholder="Lương"
        />

        <textarea
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Mô tả"
        />

        <button type="submit">Lưu</button>
      </form>
    </div>
  );
};

export default EditJob;