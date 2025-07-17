package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name="roles")
public class Role {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String name;//eg- ADMIN,USER

    public Role(){}

    public Role(String name){
        this.name=name;
    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }

    public void setId(Long id){
        this.id = id;
    }

    public void setName(String name){
        this.name=name;
    }

}
