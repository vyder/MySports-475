# ---------------- NFL ----------------------
# Get information for a player
post '/getNFLStandings' do
	conference = request["conference"]
	division = request["division"]
	content_type :json
	getNFLStandings(conference, division).to_json
end
