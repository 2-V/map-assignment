class Thing < ActiveRecord::Base
  include Protectable
  validates :name, :presence=>true

  has_many :thing_images, inverse_of: :thing, dependent: :destroy
  belongs_to :thing_type

  scope :not_linked, ->(image) { where.not(:id=>ThingImage.select(:thing_id)
                                                          .where(:image=>image)) }

  scope :with_type, -> { joins(:thing_type).select("things.*, thing_types.name as thing_type_name")}
end
