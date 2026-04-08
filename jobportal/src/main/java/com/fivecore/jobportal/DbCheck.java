
package com.fivecore.jobportal;

import java.sql.*;

public class DbCheck {
    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/jobportal?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh", "root", "1234")) {
            DatabaseMetaData metaData = conn.getMetaData();
            
            String[] tables = {"students", "jobs"};
            for (String table : tables) {
                System.out.println("TABLE: " + table);
                ResultSet rs = metaData.getColumns("jobportal", null, table, null);
                while (rs.next()) {
                    System.out.println("COLUMN: " + rs.getString("COLUMN_NAME") + " TYPE: " + rs.getString("TYPE_NAME"));
                }
                System.out.println("---\n");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
