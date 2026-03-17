package com.example.wordle.auth.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.UUID

@Entity
@Table(name = "users")
class User(
    @Id
    val id: UUID = UUID.randomUUID(),
    @Column(unique = true, nullable = false, length = 20)
    private val _username: String,
    @Column(nullable = false, length = 60)
    private val _password: String,
    @Column(unique = true, nullable = false, length = 100)
    val email: String,
    @Column(nullable = false)
    private val _enabled: Boolean = true,
    @Enumerated(EnumType.STRING)
    val role: Role = Role.USER,
) : UserDetails {
    override fun getUsername(): String = _username

    override fun getPassword(): String = _password

    override fun isEnabled(): Boolean = _enabled

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority("ROLE_${role.name}"))
    }
}

enum class Role {
    USER,
    ADMIN,
}
