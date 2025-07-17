package com.yls.ylslc.controllers;

import com.yls.ylslc.config.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "api/health")
@CrossOrigin(origins = { "https://ylslc.edisonyls.com", "http://localhost:3000" })
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    /**
     * Simple health check endpoint
     * @return Response indicating server is running
     */
    @GetMapping
    public Response health() {
        return Response.ok("Server is healthy and running");
    }

    /**
     * Detailed health check endpoint with system information
     * @return Response with detailed health information
     */
    @GetMapping("/detailed")
    public Response detailedHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        
        // Basic server info
        healthInfo.put("status", "UP");
        healthInfo.put("server", "Spring Boot Application");
        healthInfo.put("timestamp", System.currentTimeMillis());
        
        // JVM info
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> jvmInfo = new HashMap<>();
        jvmInfo.put("totalMemory", runtime.totalMemory());
        jvmInfo.put("freeMemory", runtime.freeMemory());
        jvmInfo.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
        jvmInfo.put("maxMemory", runtime.maxMemory());
        jvmInfo.put("availableProcessors", runtime.availableProcessors());
        healthInfo.put("jvm", jvmInfo);
        
        // Database connectivity check
        Map<String, Object> dbInfo = new HashMap<>();
        if (dataSource != null) {
            try (Connection connection = dataSource.getConnection()) {
                dbInfo.put("status", "UP");
                dbInfo.put("database", connection.getMetaData().getDatabaseProductName());
                dbInfo.put("version", connection.getMetaData().getDatabaseProductVersion());
            } catch (Exception e) {
                dbInfo.put("status", "DOWN");
                dbInfo.put("error", e.getMessage());
            }
        } else {
            dbInfo.put("status", "NOT_CONFIGURED");
        }
        healthInfo.put("database", dbInfo);
        
        // System properties
        Map<String, Object> systemInfo = new HashMap<>();
        systemInfo.put("javaVersion", System.getProperty("java.version"));
        systemInfo.put("osName", System.getProperty("os.name"));
        systemInfo.put("osVersion", System.getProperty("os.version"));
        systemInfo.put("serverTime", new java.util.Date());
        healthInfo.put("system", systemInfo);
        
        return Response.ok(healthInfo, "Detailed health check completed");
    }

    /**
     * Readiness probe endpoint
     * @return Response indicating if the service is ready to accept traffic
     */
    @GetMapping("/ready")
    public Response readiness() {
        // Check if application is ready to serve requests
        boolean isReady = true;
        Map<String, Object> readinessInfo = new HashMap<>();
        
        // Check database connectivity if configured
        if (dataSource != null) {
            try (Connection connection = dataSource.getConnection()) {
                readinessInfo.put("database", "READY");
            } catch (Exception e) {
                isReady = false;
                readinessInfo.put("database", "NOT_READY");
                readinessInfo.put("databaseError", e.getMessage());
            }
        } else {
            readinessInfo.put("database", "NOT_CONFIGURED");
        }
        
        readinessInfo.put("status", isReady ? "READY" : "NOT_READY");
        
        if (isReady) {
            return Response.ok(readinessInfo, "Service is ready");
        } else {
            return Response.failed(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "Service is not ready");
        }
    }

    /**
     * Liveness probe endpoint
     * @return Response indicating if the service is alive
     */
    @GetMapping("/live")
    public Response liveness() {
        // Simple liveness check - if this endpoint responds, the service is alive
        Map<String, Object> livenessInfo = new HashMap<>();
        livenessInfo.put("status", "ALIVE");
        livenessInfo.put("timestamp", System.currentTimeMillis());
        livenessInfo.put("uptime", System.currentTimeMillis() - getStartTime());
        
        return Response.ok(livenessInfo, "Service is alive");
    }
    
    /**
     * Get approximate application start time
     * @return Start time in milliseconds
     */
    private long getStartTime() {
        // This is a simple approximation. For more accurate startup time,
        // you could inject ApplicationStartup or use a @PostConstruct method
        return System.currentTimeMillis() - 
               java.lang.management.ManagementFactory.getRuntimeMXBean().getUptime();
    }
}
