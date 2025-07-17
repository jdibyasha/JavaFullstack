package com.example.demo.model;

// import jakarta.persistence.Entity;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;
import jakarta.persistence.*;

@Entity
@Table(name = "users1")
public class User {

    @Id
    private Integer id;
    private String name;
    private String password;

    @ManyToOne
    @JoinColumn(name="role_id") //this is the foreign key
    private Role role;


    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole(){
        return role;
    }

    public void setRole(Role role){
        this.role=role;
    }
}
