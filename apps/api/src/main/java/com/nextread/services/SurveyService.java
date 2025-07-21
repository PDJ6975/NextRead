package com.nextread.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nextread.entities.Survey;
import com.nextread.entities.User;
import com.nextread.dto.SurveyResponseDTO;
import com.nextread.entities.Genre;
import com.nextread.entities.PaceSelection;
import com.nextread.entities.UserBook;
import com.nextread.repositories.SurveyRepository;
import com.nextread.repositories.UserBookRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class SurveyService {

    private final SurveyRepository surveryRepository;
    private final UserBookRepository userBookRepository;
    private final GenreService genreService;

    @Autowired
    public SurveyService(SurveyRepository surveryRepository,
            UserBookRepository userBookRepository,
            GenreService genreService) {
        this.surveryRepository = surveryRepository;
        this.userBookRepository = userBookRepository;
        this.genreService = genreService;
    }

    /**
     * Busca la encuesta del usuario o crea una nueva si no existe.
     * 
     * Es el primer paso del proceso de encuestado
     * 
     * @param user El usuario
     * @return La encuesta existente o una nueva
     */
    @Transactional
    public SurveyResponseDTO findByUserOrCreate(User user) {
        Optional<Survey> survey = surveryRepository.findByUser(user);

        if (!survey.isPresent()) {
            Survey createdSurvey = createSurveyForUser(user);
            return toSurveyDto(createdSurvey);
        }

        return toSurveyDto(survey.get());
    }

    /**
     * Crea una nueva encuesta para el usuario con valores por defecto, que luego
     * actualizará
     * 
     * @param user El usuario
     * @return La encuesta creada
     */
    private Survey createSurveyForUser(User user) {

        Survey survey = Survey.builder()
                .user(user)
                .pace(PaceSelection.SLOW)
                .selectedGenres(List.of())
                .firstTime(true)
                .build();

        return surveryRepository.save(survey);
    }

    @Transactional
    public SurveyResponseDTO updatePaceGenreSurvey(PaceSelection pace, List<Long> genresIds, User user) {

        Survey survey = findSurveyByUser(user);

        // Validaciones dependiendo de firstTime
        if (Boolean.TRUE.equals(survey.getFirstTime())) {
            // Primera vez: pace y genresIds son obligatorios y lista no vacía
            if (pace == null || genresIds == null || genresIds.isEmpty()) {
                throw new RuntimeException(
                        "Debes seleccionar ritmo y al menos un género la primera vez que completas la encuesta");
            }
        }

        if (pace != null) {
            survey.setPace(pace);
        }

        if (genresIds != null && !genresIds.isEmpty()) {

            List<Genre> genres = genresIds.stream()
                    .filter(g -> g != null)
                    .map(g -> genreService.findById(g))
                    .collect(Collectors.toList()); // Usar Collectors.toList() en lugar de .toList() para lista mutable

            survey.setSelectedGenres(genres);
        }

        surveryRepository.save(survey);

        return toSurveyDto(survey);

    }

    @Transactional(readOnly = true)
    public Survey findSurveyByUser(User user) {
        return surveryRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene encuesta asociada"));
    }

    /**
     * Verifica si el usuario ya tiene libros en su historial.
     * 
     * @param user El usuario
     * @return true si ya tiene UserBooks, false si es la primera vez
     */
    @Transactional(readOnly = true)
    public boolean hasUserBooks(User user) {
        List<UserBook> userBooks = userBookRepository.findByUser(user);
        return !userBooks.isEmpty();
    }

    /**
     * Guarda una encuesta en la base de datos
     * 
     * @param survey La encuesta a guardar
     * @return La encuesta guardada
     */
    @Transactional
    public Survey saveSurvey(Survey survey) {
        return surveryRepository.save(survey);
    }

    /**
     * Elimina la encuesta del usuario, por si lo necesitamos para admin
     * 
     * @param user El usuario
     */
    @Transactional
    public void deleteSurvey(User user) {
        Optional<Survey> survey = surveryRepository.findByUser(user);
        if (survey.isPresent()) {
            surveryRepository.delete(survey.get());
        }
    }

    private SurveyResponseDTO toSurveyDto(Survey survey) {
        SurveyResponseDTO surveyDTO = SurveyResponseDTO.builder()
                .id(survey.getId())
                .pace(survey.getPace())
                .createdAt(survey.getCreatedAt())
                .updatedAt(survey.getUpdatedAt())
                .selectedGenres(survey.getSelectedGenres().stream().map(g -> g.getSelectedGenre()).toList())
                .build();

        return surveyDTO;
    }
}
