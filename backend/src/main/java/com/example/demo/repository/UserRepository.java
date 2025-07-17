package com.example.demo.repository;
import java.util.Optional;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    //Add this method to find user by userName
    Optional<User> findByName(String name);
}
