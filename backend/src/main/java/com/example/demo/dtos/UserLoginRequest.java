package com.example.demo.dtos;

public class UserLoginRequest{
    private String name;
    private String password;

    //getters and setters
    public String getName(){return name;}
    public void setName(String name) {this.name=name;}

    public String getPassword() { return password;}
    public void setPassword(String password){this.password=password;}
}