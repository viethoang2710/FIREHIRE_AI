package com.example.firehire_ai.dto;

import com.example.firehire_ai.entity.UserProfile;

public class UserProfileUpdateRequest {
    private String fullName; // Add fullName field
    private String title;
    private String bio;
    private String skills;
    private String experience;
    private String phoneNumber; // Frontend gửi phoneNumber
    private String address;
    private String linkedinUrl; // Frontend gửi linkedinUrl
    private String githubUrl; // Frontend gửi githubUrl
    private String websiteUrl; // Frontend gửi websiteUrl
    private String workPreference;
    private String salaryExpectation;
    private String dateOfBirth;
    private String gender;
    private String nationality;
    private String languages;
    private String education;
    private String certifications;

    // Convert DTO to Entity
    public UserProfile toUserProfile() {
        UserProfile profile = new UserProfile();
        profile.setTitle(this.title);
        profile.setBio(this.bio);
        profile.setSkills(this.skills);
        profile.setExperience(this.experience);
        profile.setPhone(this.phoneNumber); // Map phoneNumber -> phone
        profile.setAddress(this.address);
        profile.setLinkedin(this.linkedinUrl); // Map linkedinUrl -> linkedin
        profile.setGithub(this.githubUrl); // Map githubUrl -> github
        profile.setWebsite(this.websiteUrl); // Map websiteUrl -> website

        if (this.workPreference != null) {
            profile.setWorkPreference(UserProfile.WorkPreference.valueOf(this.workPreference));
        }
        if (this.gender != null) {
            profile.setGender(UserProfile.Gender.valueOf(this.gender));
        }

        profile.setSalaryExpectation(this.salaryExpectation);
        profile.setNationality(this.nationality);
        profile.setLanguages(this.languages);
        profile.setEducation(this.education);
        profile.setCertifications(this.certifications);

        return profile;
    }

    // Getters and Setters
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getWorkPreference() {
        return workPreference;
    }

    public void setWorkPreference(String workPreference) {
        this.workPreference = workPreference;
    }

    public String getSalaryExpectation() {
        return salaryExpectation;
    }

    public void setSalaryExpectation(String salaryExpectation) {
        this.salaryExpectation = salaryExpectation;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getCertifications() {
        return certifications;
    }

    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }
}
