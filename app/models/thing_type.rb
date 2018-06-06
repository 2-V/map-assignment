class ThingType < ActiveRecord::Base
	validates :name, :presence=>true
	has_many :things
end
