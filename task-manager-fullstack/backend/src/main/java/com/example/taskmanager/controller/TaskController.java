package com.example.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.taskmanager.repo.TaskRepository;
import com.example.taskmanager.repo.UserRepository;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import org.springframework.security.core.Authentication;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired private TaskRepository taskRepo;
    @Autowired private UserRepository userRepo;

    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepo.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public List<Task> all(Authentication authentication) {
        User u = getCurrentUser(authentication);
        return taskRepo.findByOwner(u);
    }

    @PostMapping
    public Task create(@RequestBody Task t, Authentication authentication) {
        User u = getCurrentUser(authentication);
        t.setOwner(u);
        return taskRepo.save(t);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task update, Authentication authentication) {
        User u = getCurrentUser(authentication);
        Task existing = taskRepo.findById(id).orElseThrow();
        if (!existing.getOwner().getId().equals(u.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
        existing.setTitle(update.getTitle());
        existing.setDescription(update.getDescription());
        return taskRepo.save(existing);
    }

    @DeleteMapping("/{id}")
    public Map<String,String> delete(@PathVariable Long id, Authentication authentication) {
        User u = getCurrentUser(authentication);
        Task existing = taskRepo.findById(id).orElseThrow();
        if (!existing.getOwner().getId().equals(u.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Forbidden");
        }
        taskRepo.delete(existing);
        return Map.of("status","deleted");
    }
}
