class CreateThingTypes < ActiveRecord::Migration
  def change
    create_table :thing_types do |t|
      t.string :name

      t.timestamps null: false
    end
    add_index :thing_types, [:name]

    add_column :things, :thing_type_id, :integer, null:false, default:0
  end
end