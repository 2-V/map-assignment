class AddTypToThings < ActiveRecord::Migration
  def change
    add_column :things, :typ, :string, {null: true}
  end
end
