package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type UserList []User

var jwtKey = []byte("dhsgfbgfdnhfxbdg")

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Score    int    `json:"score,default=0"`
}

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

var users = map[string]User{}

func CreateToken(username string) (string, error) {
	expirationTime := time.Now().Add(200 * time.Minute)
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func VerifyToken(tokenString string) (*Claims, error) {
	log.Println("Received token:", tokenString)

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		log.Println("Token parsing error:", err)
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	log.Println("Invalid token")
	return nil, err
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}
	if _, exists := users[user.Username]; exists {
		w.WriteHeader(http.StatusConflict) // User already exists
		json.NewEncoder(w).Encode(map[string]string{"error": "User already exists"})
		return
	}
	users[user.Username] = user
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	user, exists := users[creds.Username]
	if !exists {
		w.WriteHeader(http.StatusBadRequest) // User does not exist
		json.NewEncoder(w).Encode(map[string]string{"error": "User does not exist"})
		return
	}
	if user.Password != creds.Password {
		w.WriteHeader(http.StatusUnauthorized) // Incorrect password
		json.NewEncoder(w).Encode(map[string]string{"error": "Incorrect password"})
		return
	}

	token, err := CreateToken(creds.Username)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func Home(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Server is running"})
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	tokenString := r.Header.Get("Authorization")
	// log.Println(tokenString)
	if tokenString == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authorization header missing"})
		return
	}

	tokenString = strings.TrimPrefix(tokenString, "Bearer ")
	// log.Println(tokenString)

	claims, err := VerifyToken(tokenString)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid token"})
		return
	}
	// Here you can do whatever you want with the authenticated user, for example, return some protected data.
	response := map[string]string{"message": "Hello, " + claims.Username + "!"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func UpdateScoreHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the claims from the JWT token
	tokenString := r.Header.Get("Authorization")
	log.Println(tokenString,"dthsgfxcvdf dfvz")
	if tokenString == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authorization header missing"})
		return
	}
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")
	claims, err := VerifyToken(tokenString)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized with header"})
		return
	}

	// Update the score of the authenticated user
	user, exists := users[claims.Username]
	if !exists {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// log.Fatal(user)

	// Increment the user's score

	user.Score++

	// Store the updated user back in the database or any other storage mechanism
	users[claims.Username] = user

	// Respond with the updated user's score
	response := map[string]int{"score": user.Score}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (u UserList) Len() int {
	return len(u)
}

func (u UserList) Less(i, j int) bool {
	return u[i].Score > u[j].Score // Sort users by descending score
}

func (u UserList) Swap(i, j int) {
	u[i], u[j] = u[j], u[i]
}

func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	// Convert map of users to a slice
	userList := make(UserList, 0, len(users))
	for _, user := range users {
		userList = append(userList, user)
	}

	// Sort users by score
	sort.Sort(userList)

	// Prepare the response
	leaderboard := make([]map[string]interface{}, len(userList))
	for i, user := range userList {
		leaderboard[i] = map[string]interface{}{
			"username": user.Username,
			"score":    user.Score,
		}
	}

	// Respond with the leaderboard
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaderboard)
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", ProtectedHandler).Methods("GET")
	router.HandleFunc("/register", SignupHandler).Methods("POST")
	router.HandleFunc("/login", LoginHandler).Methods("POST")
	router.HandleFunc("/update_score", UpdateScoreHandler).Methods("GET")
	router.HandleFunc("/leaderboard", LeaderboardHandler).Methods("GET")

	// Create CORS middleware with permissive settings
	c := cors.AllowAll()

	// Wrap the router with CORS middleware
	handler := c.Handler(router)

	// Start the server with CORS middleware
	log.Println("Starting server on port :8000")
	if err := http.ListenAndServe(":8000", handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
