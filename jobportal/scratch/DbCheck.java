import java.sql.*;

public class DbCheck {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/jobportal";
        String user = "root";
        String password = "1234"; 

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            String email = "subagent_test@gmail.com"; // Verified from subagent result
            System.out.println("Checking user: " + email);
            
            PreparedStatement ps = conn.prepareStatement(
                "SELECT s.id as student_id, u.full_name FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = ?"
            );
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                int studentId = rs.getInt("student_id");
                String fullName = rs.getString("full_name");
                System.out.println("Found Student ID: " + studentId + " for " + fullName);
                
                System.out.println("--- Saved Jobs for this student ---");
                PreparedStatement ps2 = conn.prepareStatement(
                    "SELECT sj.job_id, j.title FROM saved_jobs sj JOIN jobs j ON sj.job_id = j.id WHERE sj.student_id = ?"
                );
                ps2.setInt(1, studentId);
                ResultSet rs2 = ps2.executeQuery();
                boolean found = false;
                while (rs2.next()) {
                    System.out.println("Job ID: " + rs2.getInt("job_id") + " | Title: " + rs2.getString("title"));
                    found = true;
                }
                if (!found) System.out.println("No saved jobs found in database for this student.");
            } else {
                System.out.println("User not found in database.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
