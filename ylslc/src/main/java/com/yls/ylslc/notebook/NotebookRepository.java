package com.yls.ylslc.notebook;

import com.yls.ylslc.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotebookRepository extends JpaRepository<NotebookEntity, UUID> {
    List<NotebookEntity> findByUser(UserEntity currentUser);

    @Query("SELECT COUNT(n) FROM NotebookEntity n WHERE n.user.id = :userId")
    long countNotebooksByUserId(@Param("userId") UUID userId);
}
