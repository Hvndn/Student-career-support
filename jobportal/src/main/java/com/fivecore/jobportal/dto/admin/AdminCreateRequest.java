package com.fivecore.jobportal.dto.admin;
+
+import lombok.AllArgsConstructor;
+import lombok.Builder;
+import lombok.Data;
+import lombok.NoArgsConstructor;
+
+@Data
+@NoArgsConstructor
+@AllArgsConstructor
+@Builder
+public class AdminCreateRequest {
+    private String email;
+    private String password;
+    private String fullName;
+}
+
